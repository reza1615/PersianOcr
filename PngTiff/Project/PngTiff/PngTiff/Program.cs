using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;

namespace PngTiff
{
    static class Program
    {
        static void Main()
        {
            string folder = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
            string filter = "*.png";
            string[] files = Directory.GetFiles(folder, filter);
            foreach (var file in files)
            {
                var tiffName = Path.ChangeExtension(file, ".tiff");
                if (File.Exists(tiffName))
                    File.Delete(tiffName);
                Bitmap
                    .FromFile(file)
                    .Save(tiffName, System.Drawing.Imaging.ImageFormat.Tiff);
            }
        }
    }
}
