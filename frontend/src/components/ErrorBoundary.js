import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.log("🚨 UI CRASH CAUGHT:", error);
    console.log("📌 INFO:", info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h1>⚠️ Something went wrong</h1>
          <p>The application encountered an error.</p>

          <pre style={styles.box}>
            {this.state.error?.toString()}
          </pre>

          <button
            style={styles.button}
            onClick={() =>
              window.location.reload()
            }
          >
            🔄 Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    padding: 30,
    textAlign: "center",
    fontFamily: "Arial",
  },
  box: {
    background: "#f5f5f5",
    padding: 10,
    marginTop: 20,
    textAlign: "left",
  },
  button: {
    marginTop: 20,
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default ErrorBoundary;