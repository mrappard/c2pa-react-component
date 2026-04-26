import { Manifest } from "../../../../../types";

  export interface CreativeWorkProps {
  manifest: Manifest;
  key: string;
  }
  


    const styles: { [key: string]: React.CSSProperties } = {
      sectionTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#333",
      marginBottom: "6px",
    },
  };

  

export default function CreativeWork({ manifest, key }: CreativeWorkProps) {

    const creativeWorkObject = manifest["assertions"]?.["stds.schema-org.CreativeWork"]

    const valueToDisplay = creativeWorkObject[key]



     return <>{valueToDisplay && <div style={{ marginTop: "16px" }}>
        <div style={styles.sectionTitle}>key</div>
        <div>{valueToDisplay}</div>
      </div>}</>
}