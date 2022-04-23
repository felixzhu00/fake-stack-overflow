// Tag related queries
exports.find_question = function(res, connection, id){
    const query_allq = `select name from tag inner join qt on tagId = tid where qstnId = ?`
    connection.query(query_allq, [id], function(error, results){
        if(error) throw error
        res.send(results)
    }
    )
}

exports.display_all_tags = function(res,connection){
    const query_allt = `select tid,name, count(qstnId) as tagLength from tag inner join qt on tid = tagId group by name`
    connection.query(query_allt, function(error, results){
        if(error) throw error
        res.send(results)
    }
    )
}

exports.get_one = function(connection, name){
    const query_one = `select * from tag where name = ?`
    return new Promise(function (resolve, reject){
        connection.query(query_one, [name], function(error, results){
            if(results === undefined){
                reject(new Error("Error"))
            }else{
                resolve(results)
            }
        }
        )
    })
}

exports.create_tag = function(connection, name){
    let tag = {
        name:name
    }
    return new Promise(function (resolve, reject){
        connection.query('insert into tag set ?', tag, function(error, results){
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

exports.create_qt = function(connection, qid, tid){
    let qt = {
        qstnId: qid,
        tagId: tid
    };
    return new Promise(function (resolve, reject){
        connection.query('insert into qt set ?', qt, function(error, results) {
            if(error) throw error
            resolve("Success")
        }
        )
    })
}




//select last_insert_id();