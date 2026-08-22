import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14161a",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "9999px",
            border: "2px solid #f7f7f5",
          }}
        />
      </div>
    ),
    size
  )
}
