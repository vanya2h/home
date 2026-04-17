import { renderToBuffer } from "@react-pdf/renderer";

import { CoverLetterGnosisPayPdf } from "@/cv/CoverLetterGnosisPayPdf";

export async function loader() {
  const buffer = await renderToBuffer(<CoverLetterGnosisPayPdf />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Ivan_K_Cover_Letter_Gnosis_Pay.pdf"',
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "CDN-Cache-Control": "no-store",
      Pragma: "no-cache",
    },
  });
}
