'use client'
import { mock } from "node:test"
import { addToCart } from "@/app/lib/action"

export default function Page({params}:{params:{id:string}}){
    const id = params.id
    // 根据id获取商品数据
    // 缺少一个获取商品的函数
    const mockData = {id:1,name:"catfood",desc:"it is the most popular catfood",price:120,stock:20};
    function addFun(id:number){
        // 调取添加购物车的接口，把id传进去
        addToCart(id);
    }
    return (
        <div className="flex flex-col justify-center m-auto w-2/3">
                <div className="w-4/10">
                    <figure><img className="w-1/1" src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'></img></figure>
                </div>
                <ul className="menu w-56 rounded-box bg">
                    <li>
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    name:{mockData.name}
                    </a>
                    </li>
                    <li>
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        price:{mockData.price}
                    </a>
                    </li>
                    <li>
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        stock:{mockData.stock}
                    </a>
                    </li>
                </ul>
                <div className="mt-10 bg-gray-400 rounded-lg w-1/2">
                    <p>{mockData.desc}</p>
                </div>
                <button className="btn btn-primary w-1/2" onClick={()=>{addFun(mockData.id)}}>Add to Cart</button>
        </div>
    )
}