// import emailjs from "@emailjs/nodejs";
// import { NextResponse } from "next/server";

// export async function POST() {
//   await emailjs
//     .send(
//       process.env.YOUR_SERVICE_ID as string,
//       process.env.YOUR_TEMPLATE_ID as string,
//       {},
//       {
//         publicKey: process.env.YOUR_PUBLIC_KEY as string,
//         privateKey: process.env.YOUR_PRIVATE_KEY as string,
//       }
//     )
//     .then(
//       (response) => {
//         console.log("SUCCESS!", response.status, response.text);
//         NextResponse.json({})
//       },
//       (err) => {
//         console.log("FAILED...", err);
//         NextResponse.json({})
//       }
//     );
// }
