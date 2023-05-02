export default function Loading({ loading }) {
  return (
    <div className={`${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'} modal fixed w-full h-full top-0 left-0 flex items-center justify-center`}>
      <div
        className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-[-0.125em] text-purple-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" >
          Loading...
        </span>
      </div>
      <div className="opacity-50 bg-gray-900 fixed w-full h-full top-0 left-0 flex items-center justify-center"></div>
    </div>
  );
}