var doc = new jsPDF();
doc.text('Hello world!', 20, 20);
doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
doc.addPage('l', 'a6');
doc.text('Do you like that?', 20, 20);