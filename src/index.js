const axios =require('axios');
const cheerio =require('cheerio');
const xlsx =require('xlsx');
const fs =require('fs');

const pagePath='http://quotes.money.163.com/f10/zycwzb_600519,year.html';

axios.get(pagePath).then(res=>{
    const $=cheerio.load(res.data);
    const $trs=$('.table_bg001.border_box.limit_sale.scr_table > tbody > tr[class="dbrow"]');
    const $title=$trs.eq(0).children();
    const $moneyData=$trs.eq(5).children();
    let times=[];
    let values = []
    $title.each((ind,item)=>{
        times.push([$(item).text()]);
    });
    times.forEach((item,ind)=>{
        values.push($($moneyData.eq(ind)).text())
    })
    // data.unshift(["报告日期","净利润(万元)"]);
    console.log(times,values)
    // return
    createXlsx([times,values]);
})

function createXlsx(data) {
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, workSheet, '茅台');
    const result = xlsx.write(workBook, {
        bookType: 'xlsx',
        type: 'buffer',
        compression: true
    });
    try{
        fs.writeFileSync('茅台.xlsx',result);
        console.log('导出 excel 成功！')
    } catch(err){
        console.log('导出失败！')
    }
}