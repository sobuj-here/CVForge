package com.sobuj.cvforge;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class WebAppInterface {
    private final Activity activity;

    public WebAppInterface(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public boolean isAndroidApp() {
        return true;
    }

    @JavascriptInterface
    public String getAppVersion() {
        return "1.0.0";
    }

    @JavascriptInterface
    public void showToast(final String message) {
        activity.runOnUiThread(() -> Toast.makeText(activity, message, Toast.LENGTH_SHORT).show());
    }

    @JavascriptInterface
    public void saveAndShareFile(final String base64Data, final String filename, final String mimeType) {
        activity.runOnUiThread(() -> {
            try {
                byte[] fileBytes = Base64.decode(base64Data, Base64.DEFAULT);

                // 1. Save to internal cache for FileProvider sharing
                File exportDir = new File(activity.getCacheDir(), "exports");
                if (!exportDir.exists()) {
                    exportDir.mkdirs();
                }
                File cacheFile = new File(exportDir, filename);
                try (FileOutputStream fos = new FileOutputStream(cacheFile)) {
                    fos.write(fileBytes);
                    fos.flush();
                }

                // 2. Save a copy to Android Downloads via MediaStore (Android 10+)
                saveToDownloads(filename, mimeType, fileBytes);

                // 3. Launch native Android Share / Open Chooser
                Uri contentUri = FileProvider.getUriForFile(
                        activity,
                        activity.getPackageName() + ".fileprovider",
                        cacheFile
                );

                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType(mimeType);
                shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                shareIntent.putExtra(Intent.EXTRA_SUBJECT, filename);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                Intent chooser = Intent.createChooser(shareIntent, activity.getString(R.string.share_file_title));
                activity.startActivity(chooser);

                Toast.makeText(activity, "Saved to Downloads: " + filename, Toast.LENGTH_LONG).show();

            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(activity, "Export Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    private void saveToDownloads(String filename, String mimeType, byte[] data) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.MediaColumns.DISPLAY_NAME, filename);
                values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/CVForge");

                Uri uri = activity.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri != null) {
                    try (OutputStream os = activity.getContentResolver().openOutputStream(uri)) {
                        if (os != null) {
                            os.write(data);
                            os.flush();
                        }
                    }
                }
            } else {
                File dlDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "CVForge");
                if (!dlDir.exists()) {
                    dlDir.mkdirs();
                }
                File outFile = new File(dlDir, filename);
                try (FileOutputStream fos = new FileOutputStream(outFile)) {
                    fos.write(data);
                    fos.flush();
                }
            }
        } catch (Exception e) {
            // Non-critical, cache FileProvider will still allow sharing & opening
            e.printStackTrace();
        }
    }
}
