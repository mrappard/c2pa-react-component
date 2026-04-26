import { Manifest } from "../../../../types";

  const styles: { [key: string]: React.CSSProperties } = {
card: {
    background: "white",
    borderRadius: "12px",
    padding: "24px 32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    display: "inline-block",
    maxWidth: "fit-content",
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  square: {
    width: "48px",
    height: "48px",
    backgroundColor: "#FFD700",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#000",
    letterSpacing: "-0.5px",
  },
  mediaTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#333",
    letterSpacing: "-0.3px",
  },
  claimGenerator: {
    fontSize: "14px",
    color: "#666",
  },
  thumbnail: {
    width: "48px",
    height: "48px",
    borderRadius: "4px",
    objectFit: "cover",
  },
      sectionTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#333",
      marginBottom: "6px",
    },
  };


  export interface CAWGL2Props {
  manifest: Manifest;
  }
  

export default function CAWGL2({
  manifest
}: CAWGL2Props) {

  const title = manifest.title;
  const claimGenerator = manifest.claimGenerator?manifest.claimGenerator:manifest.claimGeneratorInfo?.[0]?.name??"Unknown Claim Generator";
  const claimGeneratorInitials = claimGenerator ? claimGenerator.split(" ").map((n) => n[0].toUpperCase()).join("") : "UCG";
  const publisher = manifest.assertions["stds.schema-org.CreativeWork"]?.publisher;
  const publisherName = Array.isArray(publisher) ? publisher.map((p) => p.name).join(", ") : publisher?.name;
  
  const author = manifest.assertions["stds.schema-org.CreativeWork"]?.author;
  const authorName = Array.isArray(author) ? author.map((a) => a.name).join(", ") : author?.name;
  return (
     <div style={styles.card}>
      <div style={styles.container}>
        {
          manifest.thumbnail ? (
            <img src={manifest.thumbnail} alt="Thumbnail" style={styles.thumbnail} />
          ) : (
            <div style={styles.square}>
              <span style={styles.logoText}>{claimGeneratorInitials}</span>
            </div>
          )
        }

        <div className="flex flex-col">
          <div>
            <span style={styles.mediaTitle}>{title}</span>
          </div>
          <div>
            <span style={styles.claimGenerator}>{claimGenerator}</span>
          </div>
        </div>
      </div>
      {

      }
      {publisherName && <div style={{ marginTop: "16px" }}>
        <div style={styles.sectionTitle}>Verified Document</div>
        <div>{publisherName}</div>
      </div>}
      {authorName && <div style={{ marginTop: "16px" }}>
        <div style={styles.sectionTitle}>Author</div>
        <div>{authorName}</div>
      </div>}
    </div>
  );
}