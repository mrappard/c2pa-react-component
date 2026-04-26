import { CAWG_Header } from "../../CAWG_Header";
import { Manifest } from "../../../../types";
import { cawgStyles } from "../styles/cawgStyles";

const styles = cawgStyles;


  export interface CAWGL2Props {
  manifest: Manifest;
  moreInfo?: () => void;
}
  

export default function CAWGL2({
  manifest,
  moreInfo
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
      <CAWG_Header />
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

         {moreInfo && <div style={{ marginTop: 16 }}>
        <button onClick={moreInfo} style={styles.button}>
          More Info
        </button>
      </div>}
    </div>
  );
}