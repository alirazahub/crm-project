import { Suspense } from "react";
import EditProduct from "./edit-product";

//wrapper to fetch product data using id parameter and display loader while it is fetching 
//suspense helps streaming data fallback will be shown while the promise is being resolved

export default async function Page({params}){

    //id of dynamic route is fetched form params
    const { id } = await params ;
    console.log('edit route hit');
    const productPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`)
    .then(res => {
    return res.json();  
  });

    return (
        <>
        <Suspense fallback={<p> LOADING </p>}>
            <EditProduct productPromise={productPromise} id={id}/>
        </Suspense>
        </>
    );
}