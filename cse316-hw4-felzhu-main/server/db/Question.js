// Question-related Queries
exports.get_all_questions = function(res, connection){
    const query_allq = `select qid,title,asked_by,ask_date_time,views, count(qstnId) as answer_length from question left join qa on question.qid = qa.qstnId group by qid order by ask_date_time desc`
    connection.query(query_allq, function(error, results, fields){
        if(error) throw error
        res.send(results)
    }
    )
    
}

exports.increment_view_question = function(res, connection,id){
    const query_view = `update question set views = views + 1 where qid = ?`
    connection.query(query_view, [id], function(error, results, fields){
        if(error) throw error
        res.sendStatus(200)
    }
    )
}

exports.get_one = function(connection, id){
    const query_one = `select * from question where qid = ?`
    return new Promise(function (resolve, reject){
        connection.query(query_one, [id], function(error, results){
            if(results === undefined){
                reject(error)
            }else{
                resolve(results)
            }
        }
        )
    })
}

exports.search = function(res, connection, words){
    let tagReg = ""
    let questionReg = "\\b"
    for (let i = 0; i < words.length; i++) {
        if (words[i].charAt(0) == "[" && words[i].charAt(words[i].length - 1) == "]") {
            tagReg += words[i].substring(1, words[i].length - 1).toLowerCase()
        } else {
            questionReg += words[i] + (i == words.length-1? "" : "|")
        }
    }
    questionReg += "\\b"

    const query_searchAll = `select qid,title,asked_by,ask_date_time,views, count(qstnId) as answer_length from question left join qa on question.qid = qa.qstnId where qid in (select distinct qid from question inner join qt inner join tag on qid = qstnId and tagId = tid where text REGEXP ? or title REGEXP ? or name REGEXP ?) group by qid `
    const query_searchq = `select qid,title,asked_by,ask_date_time,views, count(qstnId) as answer_length from question left join qa on question.qid = qa.qstnId where qid in (select distinct qid from question inner join qt inner join tag on qid = qstnId and tagId = tid where text REGEXP ? or title REGEXP ?) group by qid `
    const query_searcht = `select qid,title,asked_by,ask_date_time,views, count(qstnId) as answer_length from question left join qa on question.qid = qa.qstnId where qid in (select distinct qid from question inner join qt inner join tag on qid = qstnId and tagId = tid where name REGEXP ?) group by qid `

    if(tagReg !== "" && questionReg !== "\\b\\b"){
        connection.query(query_searchAll,[questionReg,questionReg,tagReg], function(error, results){
            if(error) throw error
            res.send(results)
        })
    }else if(tagReg !== ""){
        connection.query(query_searcht,[tagReg], function(error, results){
            if(error) throw error
            res.send(results)
        })
    }else{
        connection.query(query_searchq,[questionReg, questionReg], function(error, results){
        if(error) throw error
        res.send(results)
    })
    }
}

exports.post_question = function(connection,title,text,asked_by,views){
    let question = {
        title:title,
        text:text,
    }
    if(asked_by) question.asked_by = asked_by
    if(views) question.views = views;

    return new Promise(function (resolve, reject){
        connection.query('insert into question set ?', question, function(error, results){
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


