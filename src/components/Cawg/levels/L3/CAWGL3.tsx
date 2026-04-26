const styles = {
    card: {
        background: "#f7f7f7",
        padding: "24px 26px",
        width: "330px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
        fontFamily: "Arial, sans-serif",
        color: "#111",
        lineHeight: 1.45,
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
    },
    title: {
        fontSize: "22px",
        fontWeight: 700,
        margin: 0,
    },
    chevron: {
        fontSize: "22px",
        lineHeight: "24px",
    },
    intro: {
        fontSize: "16px",
        color: "#666",
        marginTop: "4px",
        marginBottom: "22px",
    },
    publisherRow: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "20px",
    },
    logo: {
        width: "60px",
        height: "60px",
        backgroundColor: "#FFD700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
        fontWeight: 800,
        color: "#000",
        letterSpacing: "-1px",
        flexShrink: 0,
    },
    companyName: {
        fontSize: "22px",
        fontWeight: 700,
        marginBottom: "2px",
    },
    link: {
        color: "#0068a8",
        textDecoration: "underline",
        fontSize: "16px",
        cursor: "pointer",
    },
    section: {
        marginTop: "18px",
    },
    sectionTitle: {
        fontSize: "17px",
        fontWeight: 700,
        marginBottom: "2px",
    },
    muted: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "14px",
    },
    list: {
        margin: "12px 0 0 18px",
        padding: 0,
        fontSize: "16px",
    },
    listItem: {
        marginBottom: "18px",
        paddingLeft: "8px",
    },
};

export interface CAWGL3Props {
name: string;
}



export default function CAWGL3({ name }: CAWGL3Props) {


    return (
        <div style={styles.card}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>Publisher details</h2>
                <span style={styles.chevron}>⌄</span>
            </div>

            <p style={styles.intro}>
                Information shared by company or organization that published this content.
            </p>

            <div style={styles.publisherRow}>
                <div style={styles.logo}>WK</div>

                <div>
                    <div style={styles.companyName}>{name}</div>
                    <a style={styles.link}>Verified Publisher List</a>
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Verified Website</div>
                <div style={styles.muted}>Verification provided by [Publisher]</div>
                <a style={styles.link}>example.com</a>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Additional information</div>
                <div style={styles.muted}>Entered by the contributor</div>

                <ul style={styles.list}>
                    <li style={styles.listItem}>
                        Title: Cattle Grazing Beneath Stormy Skies in County Sligo
                    </li>
                    <li style={styles.listItem}>
                        Description: A group of cows graze in a green pasture surrounded by
                        rolling hills and cloudy skies in a rural landscape, likely in a
                        temperate region.
                    </li>
                    <li style={styles.listItem}>Published on: September 15, 2012</li>
                </ul>
            </div>
        </div>
    );
}