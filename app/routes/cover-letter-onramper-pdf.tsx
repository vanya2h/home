import { renderToBuffer } from "@react-pdf/renderer";

import { CoverLetterOnramperPdf } from "@/cv/CoverLetterOnramperPdf";

export async function loader() {
  const buffer = await renderToBuffer(<CoverLetterOnramperPdf />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Ivan_K_Cover_Letter_Onramper.pdf"',
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "CDN-Cache-Control": "no-store",
      Pragma: "no-cache",
    },
  });
}
