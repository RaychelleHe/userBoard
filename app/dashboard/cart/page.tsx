"use client";

import React, { useState, useEffect } from "react";
import { CurrencyYenIcon } from "@heroicons/react/24/outline";
import { getCartGoods , editCartGoods, addOrderGoods} from "@/app/lib/data";

import { number } from "zod";


export default function Page() {
    // const cartGoods = getCartGoods('410544b2-4001-4271-9855-fec4b6a6442a')


    // 假设getCartGoods是一个异步函数，返回一个Promise，该Promise解析为包含商品信息的数组
    const [cartGoods, setCartGoods] = React.useState<{ id: number; customer_id: string; name: string; price: number; amount: number }[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const [successEditMessage, setSuccessEditMessage] = useState('');
    const [showSuccessEditMessage, setShowSuccessEditMessage] = useState(false);

    // 新增一个状态来存储被勾选的商品ID
    const [selectedGoods, setSelectedGoods] = useState([]);


    // 模拟异步获取购物车商品数据
    React.useEffect(() => {
        getCartGoods('410544b2-4001-4271-9855-fec4b6a6442a').then(data => {
            setCartGoods(data);
            setLoading(false);
        });
    }, []);

    // 定义一个函数来处理成功消息的显示和自动隐藏
    const showSuccessNotification = (message) => {
        setSuccessEditMessage(message); // 设置成功消息
        setShowSuccessEditMessage(true); // 显示消息
        // 设置一个定时器，在1000毫秒（1秒）后隐藏消息
        setTimeout(() => {
            setSuccessEditMessage(''); // 清除消息
            setShowSuccessEditMessage(false); // 隐藏消息
        }, 1000);
    };
    // 修改购物车商品数量
    const handleEditCartGoods = (customer_id, name) => async () => {
        const currentCartGood = cartGoods.find(good => good.customer_id === customer_id);
        if (currentCartGood) {
            try {
                const updatedCartGoods = await editCartGoods(customer_id, name, currentCartGood.amount);
                // setSuccessEditMessage('Cart goods updated successfully'); // 设置成功消息
                showSuccessNotification('Cart goods updated successfully'); // 显示成功消息
                // setCartGoods(prevCartGoods => {
                //     return updatedCartGoods;
                // });
            } catch (error) {
                console.error("Error updating cart goods:", error);
            }
        }
    };

    // 处理单个商品勾选状态变化的函数
    const handleCheckboxChange = (e, good) => {
        if (e.target.checked) {
            setSelectedGoods(prevSelected => [...prevSelected, good.id]);
        } else {
            setSelectedGoods(prevSelected => prevSelected.filter(id => id !== good.id));
        }
    };

    // 定义居中的 CSS 类 用于显示修改成功消息
    const centerMessageStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000, // 确保消息在页面最上方
        minWidth: '200px', // 可以设置一个最小宽度
        maxWidth: '300px', // 限制最大宽度，根据需要调整
        textAlign: 'center',
        borderRadius: '5px',
        padding: '10px 15px',
        color: '#fff',
        backgroundColor: '#4caf50', // 成功消息的绿色背景
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    };
      
        // 计算选中商品的总价
        const total = cartGoods.reduce((acc, cartGood) => {
          // 检查商品是否被选中
          if (selectedGoods.includes(cartGood.id)) {
            // 累加选中商品的价格
            return acc + cartGood.price * cartGood.amount;
          }
          // 如果商品未被选中，则保持总价不变
          return acc;
        }, 0);
    // };


    return (
        <div>
            {/* <form onSubmit={(e1) => {
                                    e1.preventDefault();
                                    addOrderGoods(cartGood.customer_id, cartGood.name, cartGood.amount, cartGood.total_price)();
                                }}> */}

            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Number</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cartGoods.map((cartGood:any, index:any) => (
                        <tr key={index}>
                            <td>{cartGood.name}</td>
                            <td>{cartGood.price}</td>
                            
                            {/* <td>{cartGood.defalt_amount}</td> */}
                            
                            <td>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleEditCartGoods(cartGood.customer_id, cartGood.name)();
                                }}>
                                    <td>
                                    <input
                                    type="number"
                                    defaultValue={cartGood.amount}
                                    onChange={(e) => {
                                        const newAmount = Number(e.target.value);
                                        setCartGoods(prevCartGoods => {
                                            return prevCartGoods.map(good =>
                                                good.customer_id === cartGood.customer_id ? { ...good, amount: newAmount } : good
                                            );
                                        });
                                    }}
                                    />
                                    </td>
                                    <td>
                                    <button className="btn btn-secondary" type="submit">
                                    Upload
                                    </button>
                                    </td>
                                    
                                </form>
                            
                            </td>
                            <td>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            onChange={(e) => handleCheckboxChange(e, cartGood)}
                                            checked={selectedGoods.includes(cartGood.id)}
                                        />
                                    </label>
                                </div>
                            </td>
                        </tr>
                    ))
                    }
             {/* 显示成功 1秒后关闭 */}
            {showSuccessEditMessage && <div style={centerMessageStyle}>{successEditMessage}</div>}
                </tbody>
            </table>

            <div className="w-full h-20 fixed bottom-0 right-5 flex justify-end items-center border-t border-black">
                <div className="mr-10 flex items-center font-bold">
                    Summary: <CurrencyYenIcon className="w-5 h-5"/>
                    {/* Calculating total */}
                    {total.toFixed(2)}
                    {/* {cartGoods.reduce((acc:any, cartGood:any) => acc + cartGood.price * cartGood.amount, 0)} */}
                </div>
                
                <button onClick={() => {
                    addOrderGoods(selectedGoods[0] );
                    window.location.reload(); // 添加这行代码来刷新页面
                    showSuccessNotification('Add order successfully'); // 显示成功消息
                }
                } className="btn btn-secondary" type="submit">GO PAY</button>
                
            </div>
            {/* </form> */}
        </div>
    );
}
