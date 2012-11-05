Steps to reproduce this test:
1. First install tesseract
2. Copy lastest try per.* files to tessdata folder of installed tesseract
3. Make an png input image using arial font. Try to run boxmaker and make from it or simply make your image with 40px font size.
4. Copy your png here and run PngTiff.exe to have .tiff file
5. Run tesseract with this command: tesseract Gho-Wikipedia.tiff output -l per
6. Now you may have your output file :)