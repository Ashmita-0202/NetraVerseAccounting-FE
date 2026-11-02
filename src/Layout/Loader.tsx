import Loading from "react-loading";

const Loader = () => {
  return (
    <center className="mt-5 py-[12rem]">
      <Loading type="spokes" color="#1b3250" height={50} width={50} />
    </center>
  );
};

export default Loader;
