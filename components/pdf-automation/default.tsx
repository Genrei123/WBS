import dynamic from "next/dynamic";

const PDFAutomation = dynamic(() => import("./pdf-automation-client"), {
  ssr: false,
  loading: () => (
    <div className="container flex justify-center py-12">
      <p className="text-xl">Loading PDF Automation...</p>
    </div>
  ),
});

export default PDFAutomation;
