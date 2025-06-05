import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("GLTF Load Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", textAlign: "center", paddingTop: 50 }}>
          ⚠️ Không thể tải mô hình thử kính từ URL:<br />
          <code style={{ fontSize: 12 }}>{this.props.modelUrl}</code>
        </div>
      );
    }

    return this.props.children;
  }
}
