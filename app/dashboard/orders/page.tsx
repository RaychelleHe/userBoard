export default function Page(){
    return (
        <div className="w-4/5 m-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>price</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {Array(10).fill(1).map(d=>(
        <tr className="mb-10">
        <th>1</th>
        <td>cat food</td>
        <td>800</td>
        <td><button className="btn btn-sm">details</button></td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
    )
}