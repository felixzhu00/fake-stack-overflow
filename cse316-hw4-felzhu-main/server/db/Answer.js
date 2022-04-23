// Answer-related queries
exports.get_all = function(connection, id){
    const query_one = `select * from answer inner join qa on aid = ansId where qstnId = ? order by ans_date_time desc`
    return new Promise(function (resolve, reject){
        connection.query(query_one, [id], function(error, results){
            if(results === undefined){
                reject(new Error("Error"))
            }else{
                resolve(results)
            }
        }
        )
    })
}
exports.create_one = function(connection,text,ans_by){
    let answer = {
        text:text,
        ans_by: ans_by
    }
    return new Promise(function (resolve, reject){
        connection.query('insert into answer set ?', answer, function(error, results){
            if(error) throw error
            connection.query('select last_insert_id()', function(error, results){
                if(results === undefined){
                    reject(new Error("Error"))
                }else{
                    results = JSON.parse(JSON.stringify(results[0]))
                    let key = Object.keys(results)[0]
                    resolve(results[key]) //tid
                }
            })
        }
        )
    })
}

exports.create_qa = function(connection, qid, aid){
    let qa = {
        qstnId: qid,
        ansId: aid
    };
    return new Promise(function (resolve, reject){
        connection.query('insert into qa set ?', qa, function(error, results) {
            if(error) throw error
            resolve("Success")
        }
        )
    })
}