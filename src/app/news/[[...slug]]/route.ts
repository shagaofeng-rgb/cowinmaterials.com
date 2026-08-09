export const dynamic = "force-static";

export function GET() {
  return new Response("This automatic News service has been retired. Please use /resources for reviewed technical documentation.", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
