import pdfMake from "pdfmake";
import PdfPrinter from "pdfmake";
import { pipeline } from "stream";

export const getPDFReadableStream = (movie) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: movie.title, style: "header" },
      { text: `Year: ${movie.year}` },
      { text: `Type: ${movie.type}` },
      { text: `Poster: ${movie.poster}` },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        marginBottom: 20,
      },
    },
  };
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
