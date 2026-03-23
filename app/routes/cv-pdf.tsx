import { renderToBuffer } from "@react-pdf/renderer";

import { CvPdfDocument } from "@/cv/CvPdfDocument";

export async function loader() {
  const buffer = await renderToBuffer(<CvPdfDocument />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Ivan_Vanya2h_CV.pdf"',
    },
  });
}
