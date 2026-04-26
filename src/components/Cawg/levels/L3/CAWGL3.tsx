import React from "react";
import { Manifest } from "../../../../types";
import CreativeWork from "./CreativeWork/CreativeWork";
import { CAWG_Header } from "../../CAWG_Header";
import { cawgStyles } from "../styles/cawgStyles";

const styles = cawgStyles;

export interface CAWGL3Props {
    manifest: Manifest;
      moreInfo?: () => void;
}

export default function CAWGL3({ manifest, moreInfo }: CAWGL3Props) {
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

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <span style={styles.mediaTitle}>{title}</span>
                    </div>
                    <div>
                        <span style={styles.claimGenerator}>{claimGenerator}</span>
                    </div>
                </div>
            </div>
            
            <CreativeWork manifest={manifest} />
            {moreInfo && <div style={{ marginTop: 16 }}>
                <button onClick={moreInfo} style={styles.button}>
                    Small View
                </button>
            </div>}
        </div>
    );
}
