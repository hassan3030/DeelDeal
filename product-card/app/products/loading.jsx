import Loading from '@/components/Loading'

const LoadingPage = ({loading}) => {
  if (!loading) {
    loading = "All PRODUCTS...";
  }
  return (
    <div>
      <Loading pageName ={loading}/>
    </div>
  );
};

export default LoadingPage;
