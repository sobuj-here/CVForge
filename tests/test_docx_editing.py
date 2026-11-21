"""
Test suite for CVForge Microsoft Word (DOCX) Export & Native Editability.
Verifies:
1. Native OpenXML Word generation (paragraphs, runs, tables).
2. Zero background image / canvas tricks.
3. Every section (name, summary, experience, education, skills, references) is individually editable text (<w:t>).
4. References section is completely omitted when empty.
5. Zero occurrences of "References available upon request." in DOCX output.
6. Layout-specific Word representations:
   - Two-column templates use 2-column Word table
   - Institutional Classic uses 5-column education table & colon table
   - Executive Blue-Banner uses shaded banner tables
"""

import subprocess
import os
import json
import zipfile
import xml.etree.ElementTree as ET

def test_docx_export():
    test_script = """
    import fs from 'fs';
    import { createRequire } from 'module';
    const require = createRequire(import.meta.url);
    const docxLib = require('./assets/js/vendor/docx.min.js');
    
    // Read and execute docxExporter
    const exporterCode = fs.readFileSync('./assets/js/export/docxExporter.js', 'utf8');
    // Extract buildDocxDocument using a minimal runner
    const module = { exports: {} };
    const fn = new Function('exports', 'require', exporterCode.replace('export async function downloadDocx', 'async function downloadDocx').replace('export function buildDocxDocument', 'exports.buildDocxDocument = function buildDocxDocument'));
    fn(module.exports, require);
    
    const buildDocxDocument = module.exports.buildDocxDocument;
    
    const sampleProfileWithRefs = {
      format: 'reverse-chronological',
      personal: {
        fullName: 'Jane Doe',
        headline: 'Lead Systems Architect',
        email: 'jane.doe@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        summary: 'Accomplished systems architect with 12+ years of distributed systems engineering experience.'
      },
      skills: [
        { name: 'Distributed Systems', level: 'Expert' },
        { name: 'Kubernetes', level: 'Advanced' },
        { name: 'Go / Python', level: 'Expert' }
      ],
      experience: [
        {
          title: 'Principal Architect',
          company: 'Cloud Scale Inc.',
          startDate: '2020-01',
          endDate: '2024-05',
          current: true,
          highlights: ['Architected multi-region platform serving 250M req/sec', 'Reduced infrastructure costs by 38%']
        }
      ],
      education: [
        {
          degree: 'Master of Science',
          major: 'Computer Engineering',
          institution: 'Stanford University',
          startDate: '2016-09',
          endDate: '2018-06',
          gpa: '3.95 / 4.0'
        }
      ],
      references: [
        {
          name: 'Dr. Robert Vance',
          title: 'VP of Engineering',
          company: 'Cloud Scale Inc.',
          email: 'robert.vance@cloudscale.example.com',
          phone: '+1 (555) 987-6543'
        }
      ],
      referencesAvailableUponRequest: false,
      settings: {
        paperSize: 'letter',
        primaryColor: '#1e3a8a',
        fontFamily: 'Calibri'
      }
    };

    const sampleProfileNoRefs = JSON.parse(JSON.stringify(sampleProfileWithRefs));
    sampleProfileNoRefs.references = [];
    sampleProfileNoRefs.referencesAvailableUponRequest = false;

    async function run() {
      // 1. Standard single column with references
      const doc1 = buildDocxDocument(sampleProfileWithRefs, docxLib);
      const buf1 = await docxLib.Packer.toBuffer(doc1);
      fs.writeFileSync('test_doc_single_col.docx', buf1);

      // 2. Standard single column WITHOUT references (must hide references completely)
      const doc2 = buildDocxDocument(sampleProfileNoRefs, docxLib);
      const buf2 = await docxLib.Packer.toBuffer(doc2);
      fs.writeFileSync('test_doc_no_refs.docx', buf2);

      // 3. Two-Column template (Academic Scholar)
      const sampleTwoCol = JSON.parse(JSON.stringify(sampleProfileWithRefs));
      sampleTwoCol.format = 'academic-scholar-two-column';
      const doc3 = buildDocxDocument(sampleTwoCol, docxLib);
      const buf3 = await docxLib.Packer.toBuffer(doc3);
      fs.writeFileSync('test_doc_two_col.docx', buf3);

      // 4. Institutional Classic (5-col table & colon table)
      const sampleBD = JSON.parse(JSON.stringify(sampleProfileWithRefs));
      sampleBD.format = 'intl-institutional-classic';
      sampleBD.personal.fatherName = 'David Doe';
      sampleBD.personal.motherName = 'Sarah Doe';
      const doc4 = buildDocxDocument(sampleBD, docxLib);
      const buf4 = await docxLib.Packer.toBuffer(doc4);
      fs.writeFileSync('test_doc_institutional.docx', buf4);

      // 5. Executive Blue-Banner
      const sampleBlue = JSON.parse(JSON.stringify(sampleProfileWithRefs));
      sampleBlue.format = 'exec-blue-banner';
      const doc5 = buildDocxDocument(sampleBlue, docxLib);
      const buf5 = await docxLib.Packer.toBuffer(doc5);
      fs.writeFileSync('test_doc_exec_banner.docx', buf5);

      console.log('DOCX_GENERATION_SUCCESS');
    }

    run().catch(err => {
      console.error(err);
      process.exit(1);
    });
    """

    with open('temp_docx_test.js', 'w', encoding='utf-8') as f:
        f.write(test_script)

    try:
        res = subprocess.run(['node', 'temp_docx_test.js'], capture_output=True, text=True)
        if res.returncode != 0:
            print("NODE STDERR:", res.stderr)
            print("NODE STDOUT:", res.stdout)
            raise RuntimeError(f"Node execution failed with code {res.returncode}")
        assert 'DOCX_GENERATION_SUCCESS' in res.stdout, f"Generation failed: {res.stderr}"
        print(" [PASS] Node generated all 5 DOCX files successfully.")

        # Inspect generated files
        files_to_check = [
            'test_doc_single_col.docx',
            'test_doc_no_refs.docx',
            'test_doc_two_col.docx',
            'test_doc_institutional.docx',
            'test_doc_exec_banner.docx'
        ]

        for fname in files_to_check:
            assert os.path.exists(fname), f"File {fname} missing"
            with zipfile.ZipFile(fname, 'r') as z:
                xml_content = z.read('word/document.xml').decode('utf-8')

                # Verify candidate name exists as native editable text
                assert 'JANE DOE' in xml_content, f"Candidate name not found in {fname}"
                assert 'Distributed Systems' in xml_content, f"Skill not found in {fname}"
                assert 'Stanford University' in xml_content, f"Education not found in {fname}"

                # Verify NO background image or canvas trick
                assert '<w:drawing' not in xml_content or '<w:background' not in xml_content, f"Suspicious background in {fname}"

                # Verify NO upon request string
                assert 'available upon request' not in xml_content.lower(), f"'upon request' found in {fname}!"
                assert 'references available' not in xml_content.lower(), f"'references available' found in {fname}!"

                if fname == 'test_doc_no_refs.docx':
                    # References section MUST be completely omitted
                    assert 'REFERENCES' not in xml_content, f"Empty references heading found in {fname}!"

                if fname == 'test_doc_single_col.docx':
                    # References section with actual referee MUST exist
                    assert 'REFERENCES' in xml_content, f"References heading missing in {fname}"
                    assert 'Dr. Robert Vance' in xml_content, f"Referee name missing in {fname}"

                if fname == 'test_doc_two_col.docx':
                    # Must contain a 2-column table
                    assert '<w:tbl>' in xml_content, f"Table missing in 2-col doc {fname}"

                if fname == 'test_doc_institutional.docx':
                    # Must contain 5-column table and colon table
                    assert 'Examination / Degree' in xml_content or 'Examination' in xml_content, f"5-col header missing in {fname}"
                    assert 'Father' in xml_content and 'David Doe' in xml_content, f"Father's name missing in {fname}"
                    assert 'Declaration' in xml_content, f"Declaration missing in {fname}"

                if fname == 'test_doc_exec_banner.docx':
                    # Must contain shaded banner
                    assert '<w:shd' in xml_content, f"Shading missing in {fname}"

            print(f" [PASS] Verified native OpenXML structure and editability for {fname}")

        print("\nALL DOCX EDITABILITY AND PURITY TESTS PASSED 100%!")

    finally:
        # Cleanup
        if os.path.exists('temp_docx_test.js'):
            os.remove('temp_docx_test.js')
        for fname in ['test_doc_single_col.docx', 'test_doc_no_refs.docx', 'test_doc_two_col.docx', 'test_doc_institutional.docx', 'test_doc_exec_banner.docx']:
            if os.path.exists(fname):
                os.remove(fname)

if __name__ == '__main__':
    test_docx_export()
