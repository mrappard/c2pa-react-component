export const cawgStyles: { [key: string]: React.CSSProperties } = {

    card: {
    background: "white",
    borderRadius: "12px",
    padding: "16px 16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    display: "inline-block",
    width: "95%", 
   
    

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
  button: {
    width: '100%',
    height: 42,
    borderRadius: 999,
    border: '2px solid #666',
    background: '#fff',
    fontWeight: 700,
    fontSize: 16,
    color: '#666',
    cursor: 'pointer',
  } satisfies React.CSSProperties,


      sectionTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#333",
      marginBottom: "6px",
    },

};