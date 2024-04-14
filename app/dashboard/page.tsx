import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
const goods = [
    {id:1,name:"cat food",desc:"it is the most popular dog toy"},
    {id:2,name:"cat food",desc:"it is the most popular dog toy"},
    {id:3,name:"cat food",desc:"it is the most popular dog toy"},
    {id:4,name:"cat food",desc:"it is the most popular dog toy"},

]
export  default function Page(){
    return (
    <div className="w-1/1">
        <div className="w-80 right-5 fixed z-10">
            <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow border-transparent" placeholder="Search" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
        </div>
        <div className="flex flex-wrap">
        {/**这里的[0,1,2,3,4,5,6]换成实际数据 */}
        {goods.map(d=>{return (
            <div className="card card-compact w-1/5 flex-shrink-0 shadow-xl m-5 " key={d.id}>
                <figure><img src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg' alt="Shoes" /></figure>
                <div className="card-body">
                <h2 className="card-title">{d.name}</h2>
                <p>{d.desc}</p>
                <div className="card-actions justify-end">
                    <Link href={`/dashboard/goods/${d.id}`}></Link>
                    <button className="btn btn-primary">Buy Now</button>
                </div>
                </div>
            </div>
        )})}
        </div>
        <div className="bottom-10 right-10 fixed rounded-full bg-green-200">
            <ShoppingCartIcon className="h-20 w-20 text-blue-500" />
        </div>
  </div>
  );
}