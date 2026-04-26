import { CAWG_Header } from "../../CAWG_Header";
import { Manifest } from "../../../..";
import { cawgStyles } from "../styles/cawgStyles";

export interface CAWGL1Props {
  manifest: Manifest;
  moreInfo?: () => void;
}


const styles = cawgStyles;

export function CAWGL1({
  manifest,
  moreInfo
}: CAWGL1Props) {



  // const signer = manifest.signatureInfo.common_name; 
  const title = manifest.title;
  const claimGenerator = manifest.claimGenerator ? manifest.claimGenerator : manifest.claimGeneratorInfo?.[0]?.name ?? "Unknown Claim Generator";
  const claimGeneratorInitials = claimGenerator ? claimGenerator.split(" ").map((n) => n[0].toUpperCase()).join("") : "UCG";
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
     {moreInfo && <div style={{ marginTop: 16 }}>
        <button onClick={moreInfo} style={styles.button}>
          More Info
        </button>
      </div>}
      
    </div>
  );


}