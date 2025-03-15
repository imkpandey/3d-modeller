"use client";

import { useCallback, useState } from "react";
import { useEditor, UPLOAD_STATES } from "./store";
import { Upload, X } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width="1995"
        height="394"
        viewBox="0 0 1995 394"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-min w-[90px] lg:w-[118px]"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M70.3476 13.814C53.5182 -2.98135 27.3244 -4.07046 11.843 11.3833C-3.63839 26.8371 -2.55092 52.9778 14.2785 69.7694L322.517 377.379C339.347 394.175 365.54 395.264 381.022 379.81C396.503 364.356 395.416 338.216 378.586 321.424L70.3476 13.814ZM243.899 101.473C266.455 53.2389 338.627 8.63379 338.627 8.63379C365.26 -12.722 410.548 14.5616 382.007 48.172C377.725 53.2152 372.938 58.1375 368.136 63.0753C340.938 91.0454 313.254 119.514 373.942 173.293C413.91 208.71 374.268 237.098 349.092 230.064C323.917 223.031 220.795 150.877 243.899 101.473ZM47.8496 392.553C24.0311 389.917 9.00518 373.88 2.9896 350.683C-1.461 333.521 -2.26543 318.656 9.96782 305.823C24.0005 291.103 42.831 293.52 61.806 300.839C89.4328 311.494 110.921 341.138 97.694 367.63C87.9722 387.101 69.4806 394.946 47.8496 392.553ZM11.6633 159.715C27.1447 144.262 53.3385 145.351 70.1679 162.146L232.156 323.806C248.986 340.598 250.073 366.738 234.592 382.192C219.11 397.646 192.917 396.557 176.087 379.762L14.0988 218.102C-2.73061 201.31 -3.81808 175.169 11.6633 159.715ZM668.645 355.954C639.636 355.954 612.57 348.777 587.449 334.422C562.327 319.767 542.29 300.179 527.336 275.655C512.383 251.132 504.906 224.664 504.906 196.253C504.906 167.842 512.383 141.524 527.336 117.299C542.29 92.7759 562.327 73.3366 587.449 58.9814C612.57 44.3271 639.636 37 668.645 37C691.673 37 713.505 41.6355 734.141 50.9066C751.85 58.4963 767.526 68.6541 781.169 81.38C785.268 85.2036 784.981 91.6753 780.809 95.4187L747.994 124.86C743.837 128.59 737.46 128.134 733.421 124.277C725.785 116.985 717.202 111.071 707.673 106.533C695.412 100.253 682.402 97.1124 668.645 97.1124C651.897 97.1124 636.047 101.748 621.094 111.019C606.439 119.991 594.776 132.103 586.103 147.356C577.43 162.608 573.093 178.907 573.093 196.253C573.093 213.898 577.43 230.346 586.103 245.599C594.776 260.851 606.439 273.113 621.094 282.384C636.047 291.356 651.897 295.842 668.645 295.842C682.402 295.842 695.412 292.851 707.673 286.87C717.208 282.103 725.795 276.043 733.434 268.691C737.458 264.818 743.837 264.364 747.994 268.094L780.809 297.536C784.981 301.279 785.268 307.75 781.175 311.58C767.53 324.347 751.852 334.653 734.141 342.496C713.206 351.468 691.374 355.954 668.645 355.954ZM890.283 102.047C895.789 102.047 900.252 106.51 900.252 112.016V340.602C900.252 346.108 904.715 350.571 910.221 350.571H956.676C962.182 350.571 966.645 346.108 966.645 340.602V112.016C966.645 106.51 971.108 102.047 976.614 102.047H1052.68C1058.18 102.047 1062.65 97.5839 1062.65 92.0782V52.3522C1062.65 46.8465 1058.18 42.3833 1052.68 42.3833H814.221C808.715 42.3833 804.252 46.8465 804.252 52.3522V92.0782C804.252 97.5838 808.715 102.047 814.221 102.047H890.283ZM1288.38 350.571C1285.14 350.571 1282.1 348.993 1280.23 346.341L1215.76 254.764C1213.89 252.112 1210.85 250.534 1207.61 250.534H1173.85C1168.34 250.534 1163.88 254.997 1163.88 260.502V340.602C1163.88 346.108 1159.42 350.571 1153.91 350.571H1107.91C1102.4 350.571 1097.94 346.108 1097.94 340.602V52.3522C1097.94 46.8465 1102.4 42.3833 1107.91 42.3833H1236.55C1258.69 42.3833 1278.57 46.8693 1296.22 55.8413C1313.86 64.5142 1327.62 76.7759 1337.49 92.6265C1347.66 108.477 1352.74 126.421 1352.74 146.458C1352.74 169.188 1346.31 189.075 1333.45 206.122C1323.39 219.776 1310.55 230.36 1294.93 237.874C1288.97 240.738 1286.54 248.272 1290.34 253.676L1347.51 334.863C1352.16 341.467 1347.44 350.571 1339.36 350.571H1288.38ZM1163.88 180.004C1163.88 185.509 1168.34 189.973 1173.85 189.973H1229.38C1245.83 189.973 1259.13 186.085 1269.3 178.309C1279.47 170.234 1284.55 159.617 1284.55 146.458C1284.55 133.3 1279.47 122.832 1269.3 115.056C1259.13 106.982 1245.83 102.944 1229.38 102.944H1173.85C1168.34 102.944 1163.88 107.407 1163.88 112.913V180.004ZM1459.84 338.459C1481.07 350.123 1505.15 355.955 1532.06 355.955C1558.98 355.955 1583.05 350.123 1604.29 338.459C1625.52 326.496 1641.97 310.048 1653.63 289.113C1665.59 267.879 1671.58 243.954 1671.58 217.337V52.3522C1671.58 46.8465 1667.11 42.3833 1661.61 42.3833H1615.15C1609.65 42.3833 1605.18 46.8465 1605.18 52.3522V214.646C1605.18 230.197 1602.04 244.253 1595.76 256.814C1589.48 269.076 1580.81 278.646 1569.74 285.524C1558.68 292.403 1546.12 295.842 1532.06 295.842C1518.01 295.842 1505.29 292.403 1493.93 285.524C1482.86 278.646 1474.19 269.076 1467.91 256.814C1461.63 244.253 1458.49 230.197 1458.49 214.646V52.3522C1458.49 46.8465 1454.03 42.3833 1448.52 42.3833H1402.52C1397.01 42.3833 1392.55 46.8465 1392.55 52.3522V217.337C1392.55 243.954 1398.38 267.879 1410.04 289.113C1422 310.048 1438.6 326.496 1459.84 338.459ZM1994.97 52.3522C1994.97 46.8465 1990.5 42.3833 1985 42.3833H1938.99C1933.49 42.3833 1929.02 46.8465 1929.02 52.3522V153.536C1929.02 159.042 1924.56 163.505 1919.05 163.505H1798.58C1793.07 163.505 1788.61 159.042 1788.61 153.536V52.3522C1788.61 46.8465 1784.15 42.3833 1778.64 42.3833H1732.63C1727.13 42.3833 1722.67 46.8465 1722.67 52.3522V340.602C1722.67 346.108 1727.13 350.571 1732.63 350.571H1778.64C1784.15 350.571 1788.61 346.108 1788.61 340.602V233.138C1788.61 227.632 1793.07 223.169 1798.58 223.169H1919.05C1924.56 223.169 1929.02 227.632 1929.02 233.138V340.602C1929.02 346.108 1933.49 350.571 1938.99 350.571H1985C1990.5 350.571 1994.97 346.108 1994.97 340.602V52.3522Z"
          fill="white"
        ></path>
      </svg>
    </div>
  );
}

export default function UploadDialog() {
  const {
    showUploadDialog,
    setShowUploadDialog,
    fileUploadState,
    setFileUploadState,
    errorMessage,
    setErrorMessage,
    setModelUrl,
    setModelName,
    setModel,
    setModelMeshes,
    setPosition,
    setRotation,
    setScale,
    setSelectedObject,
    resetEditorState,
  } = useEditor();

  const handleFileUpload = useCallback(
    (file) => {
      if (!file) return;

      setFileUploadState(UPLOAD_STATES.LOADING);
      setErrorMessage("");

      try {
        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
          throw new Error("File size exceeds 50MB limit");
        }

        // Check file extension
        const validExtensions = [".glb", ".gltf"];
        const fileExtension = "." + file.name.split(".").pop().toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
          throw new Error(
            `Unsupported file format. Supported formats: ${validExtensions.join(
              ", "
            )}`
          );
        }

        // Set model name from file name
        const name = file.name.split(".")[0];
        setModelName(name);

        //Reset Editor state before loading new model
        resetEditorState();

        // Reset any previous model and selections
        setModel(null);
        setModelMeshes([]);

        // Create object URL for the file
        const objectUrl = URL.createObjectURL(file);
        setModelUrl(objectUrl);

        // Reset transform values
        setPosition([0, 0, 0]);
        setRotation([0, 0, 0]);
        setScale([1, 1, 1]);

        setFileUploadState(UPLOAD_STATES.SUCCESS);
        setShowUploadDialog(false);
      } catch (error) {
        setFileUploadState(UPLOAD_STATES.ERROR);
        setErrorMessage(error.message);
        console.error("Error processing model file:", error);
      }
    },
    [
      setErrorMessage,
      setFileUploadState,
      setModelName,
      setModelUrl,
      setPosition,
      setRotation,
      setScale,
      setShowUploadDialog,
      setModel,
      setSelectedObject,
      setModelMeshes,
    ]
  );

  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const onFileChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    },
    [handleFileUpload]
  );

  if (!showUploadDialog) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-[#191919] p-6 shadow-xl w-[500px] max-w-[90%]">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowUploadDialog(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-xl font-bold text-white mt-4">3D Model Viewer</h2>
          <p className="text-md font-light text-white/70">
            View, edit and render your 3D models
          </p>
        </div>
        <div
          className={`border-2 border-dashed p-8 my-4 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-900/20" : "border-white/20"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="mb-4">
            <Upload className="mx-auto h-12 w-12 text-white/70" />
          </div>

          <p className="text-sm text-white/70 mb-2">
            Drag and drop your 3D model file here, or click to browse
          </p>
          <p className="text-xs text-white/40">
            Supported formats: .glb, .gltf (Max 50MB)
          </p>

          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept=".glb,.gltf"
            onChange={onFileChange}
          />

          <button
            type="button"
            onClick={() => document.getElementById("file-upload").click()}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none
"
            disabled={fileUploadState === UPLOAD_STATES.LOADING}
          >
            {fileUploadState === UPLOAD_STATES.LOADING
              ? "Loading..."
              : "Browse Files"}
          </button>
        </div>

        {fileUploadState === UPLOAD_STATES.ERROR && (
          <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 rounded-lg">
            <span className="font-medium">Error:</span> {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
