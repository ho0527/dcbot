import chalk from "chalk"
import mysql from "mysql2"

let db

try{
    // 建立 MySQL 連線
    db=mysql.createPool({ host:"localhost",database:"dcbot",user:"root",password:"" })

    // 連線至 MySQL
    db.getConnection(function(event,connection){
        if(!event){
            console.log(chalk.green("{"+time()+"} 連線至MySQL success!"))
            connection.release()
        }else{
            console.log(chalk.red("{"+time()+"} 無法連線至 MySQL "+event))
        }
    })
}catch(error){
    console.log("{"+time()+"} [ERROR]link connect error!"+error)
}

export { db }

export function query(dbname,sql,data=[],callback=function(error,result,field){}){
    dbname.query(sql,data,callback)
}

export function time(date=new Date()){
    let year=date.getFullYear()
    let month=String(date.getMonth()+1).padStart(2,"0")
    let day=String(date.getDate()).padStart(2,"0")
    let hours=String(date.getHours()).padStart(2,"0")
    let minutes=String(date.getMinutes()).padStart(2,"0")
    let seconds=String(date.getSeconds()).padStart(2,"0")

    return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
}