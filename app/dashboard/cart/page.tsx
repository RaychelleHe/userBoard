import { CurrencyYenIcon } from "@heroicons/react/24/outline"

export default function Page(){
    return (
        <div>
            <table className="table">
                {/* head */}
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>price</th>
                    <th>number</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {Array(10).fill(1).map(d=>(
                        <tr className="mb-10">
                            <th>1</th>
                            <td>cat food</td>
                            <td>800</td>
                            <td><input></input></td>
                            <td>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <input type="checkbox" className="checkbox checkbox-primary" />
                                    </label>
                                </div>
                            </td>
                        </tr>
                ))}
                </tbody>
            </table>
                 <div className="w-1/1 h-20 bottom-0 right-5 fixed flex justify-end border-black align-middle">
                         <div className="mr-10 flex font-bold">Summary:<CurrencyYenIcon className="w-5 h-5"/>1000</div>
                         <button className="btn btn-secondary">GO PAY</button>
                     </div>
        </div>
    )
}