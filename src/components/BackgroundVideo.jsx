export default function BackgroundVideo({ videoRef, videoUrl }) {
  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-full bg-black/40 -z-0"
      ></div>
    </>
  );
}
