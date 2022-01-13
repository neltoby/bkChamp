import { db } from '../processes/db'
import { AsyncStorage } from 'react-native';
import { CacheManager } from "react-native-expo-image-cache";
// import { fetchArchived } from './request'

export const LIKE = 'LIKE'
export const ARCHIVE = 'ARCHIVE'
export const UNARCHIVE = 'UNARCHIVE'
export const SETARTICLE = 'SETARTICLE'
export const PREV_SEARCH = 'PREV_SEARCH'
export const SET_SUBJECT = 'SET_SUBJECT'
export const ERR_ARCHIVE = 'ERR_ARCHIVE'
export const LOAD_ARCHIVE = 'LOAD_ARCHIVE'
export const GET_ARCHIVED = 'GET_ARCHIVED'
export const READ_ARTICLE = 'READ_ARTICLE'
export const SET_CATEGORY_IMAGES = 'SET_CATEGORY_IMAGES'
export const SEARCH_ARCHIVE = 'SEARCH_ARCHIVE'
export const LOADING_ARCHIVE = 'LOADING_ARCHIVE'
export const LOADING_ARTICLE = 'LOADING_ARTICLE'
export const ARCHIVED_ARTICLE = 'ARCHIVED_ARTICLE'
export const ARTICLE_REMOVE_ERR = 'ARTICLE_REMOVE_ERR'
export const UNARCHIVED_ARTICLE = 'UNARCHIVED_ARTICLE'
export const LOADING_ARTICLE_STOP = 'LOADING_ARTICLE_STOP'
export const ARTICLE_LOADING_FAILED = 'ARTICLE_LOADING_FAILED'

// action function for liking an article
export const like = payload => {
    return {
        type: LIKE,
        payload: payload
    }
}

// acton function for archiving an article
export const archived = payload => {
    return {
        type: ARCHIVE,
        payload
    }
}

export const archivedArticle = payload => ({ type: ARCHIVED_ARTICLE, payload })

export const unarchivedArticle = payload => ({ type: UNARCHIVED_ARTICLE, payload })

export const loadingArchive = payload => ({ type: LOADING_ARCHIVE, payload })

export const errArchive = payload => ({ type: ERR_ARCHIVE, payload })

// action function for unarchiving an article
export const unarchive = payload => {
    return {
        type: UNARCHIVE,
        payload
    }
}

export const loadArchive = payload => ({ type: LOAD_ARCHIVE, payload })

export const resolveUnarchivedArticles = payload => {
    return dispatch => {
        (
            () => {
                const { id } = payload
                const sql = 'DELETE FROM archive WHERE id = ?'
                db.transaction(tx => {
                    tx.executeSql(sql, [id], (txO, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            dispatch(unarchivedArticle(payload))
                            dispatch(unarchive({ item: payload }))
                        }
                    }, err => console.log('failed delete'))
                }, err => console.log(err, 'failed transxn line 62'),
                    () => console.log('sux transxn line 63'))
            }
        )()
    }
}

export const resolveArchive = payload => {
    return dispatch => {
        (
            () => {
                dispatch(onArticleSuccess(payload))
                const sql = 'INSERT INTO archive(id, category) VALUES(?,?)'
                payload.forEach(item => {
                    db.transaction(tx => {
                        tx.executeSql(sql, [item.id, item.category], (txO, { rowsAffected }) => {
                            console.log(rowsAffected)
                        }, err => console.log(err, 'from insert err'))
                    }, err => console.log('failed insert trans'),
                        () => console.log('successful trans'))
                })
            }
        )()
    }
}

export const getArchiveCategory = payload => {
    return dispatch => {
        (
            async () => {
                dispatch(loadingArchive(true))
                const sql = 'SELECT t.* FROM articles t INNER JOIN archive a USING(id) WHERE t.category = ?'
                db.transaction(tx => {
                    tx.executeSql(sql, [payload], (txO, { rows }) => {
                        const { _array } = rows
                        console.log(_array, 'from join query')
                        dispatch(loadingArchive(false))
                        dispatch(archivedArticle(_array))
                    }, err => console.log(err, 'err from join query'))
                }, err => console.log(err),
                    () => console.log('trans succesful'))
            }
        )()
    }
}

export const getArchived = () => {
    return dispatch => {
        (
            async () => {
                dispatch(loadingArchive(true))
                const sql = 'SELECT DISTINCT category from archive'
                let newArr = []
                await db.transaction(tx => {
                    tx.executeSql(sql, null, (txO, { rows }) => {
                        const { _array, length } = rows
                        console.log(rows)
                        if (length) {
                            _array.forEach(item => {
                                let val = Object.values(item)[0]
                                const sqli = 'SELECT id FROM archive WHERE category = ?'
                                txO.executeSql(sqli, [val], (txOb, { rows }) => {
                                    const { _array } = rows
                                    let ids = []
                                    _array.forEach(element => {
                                        ids = [...ids, Object.values(element)[0]]
                                    })
                                    newArr = [...newArr, { category: val, value: ids }]
                                    dispatch(loadArchive(newArr))
                                    dispatch(loadingArchive(false))
                                }, err => console.log(err, 'select id query failed'))
                            })
                        } else {
                            // dispatch(fetchArchived())
                        }
                    },
                        err => console.log(err, 'failed select query'))
                },
                    err => console.log('err in transaction'),
                    () => console.log('successful transaction'))
                // dispatch(loadArchive(newArr))
            }
        )()
    }
}

export const updateSeenArticle = payload => {
    return function (dispatch, getState) {
        (async () => {
            dispatch(readArticle(payload))
            db.transaction(tx => {
                const sql = 'UPDATE articles SET read = 1 WHERE id = ?'
                tx.executeSql(sql, [payload], (txObj, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        console.log('article was updated')
                    }
                },
                    err => console.log(err))
            },
                err => console.log(err),
                () => console.log('successful update on seen'))
        })()
    }
}

// takes an object with id property as param and registers the id 
// in the unsent table  with title indicating what action it was
export const onFailedLike = payload => {
    return function (dispatch, getState) {
        (async () => {
            const { id, state } = payload
            // dispatch the like id to update redux store
            console.log('like has been dispatched')
            dispatch(like(id))
            const sql = 'INSERT OR REPLACE INTO unsent( id, title ) VALUES(?,?)'
            const liked = state === 1 ? 'like' : 'unlike'
            db.transaction(tx => {
                // insert the id of the article to the unsent table 
                // in database to be sent when network is favorable
                tx.executeSql(sql, [id, liked], (txObj, { insertId, rowsAffected }) => {
                    console.log(rowsAffected, 'rows affected with  id ', insertId)
                    // update the store and database with the likeDisperse action constructor
                    dispatch(likeDisperse(payload))
                }, err => console.log(err, 'error updating like'))
            }, err => console.log(err), () => {
                console.log('unsent has been inserted')
            })
        })()
    }
}

// takes an object params and updates the 
// articles table and the redux store like property 
// on the displayitems object
export const likeDisperse = payload => {
    return function (dispatch, getState) {
        (async () => {
            const sqli = 'SELECT * FROM articles WHERE id = ?'
            const sql = 'UPDATE articles SET liked = ?, likes = ? WHERE id = ?'
            db.transaction(tx => {
                // select the row with the specified id               
                tx.executeSql(sqli, [payload.id], (txObj, { rows: { length, _array } }) => {
                    if (length > 0) {
                        // update the articles table with the specified id
                        const liked = payload.state === 1 ? 1 : 0
                        let likes = payload.state === 1 ? _array[0].likes + 1 : _array[0].likes - 1
                        txObj.executeSql(sql, [liked, likes, payload.id], (txO, { rowsAffected }) => {
                            console.log(rowsAffected, 'rows affected')
                        },
                            err => console.log(err, 'error updating like'))
                    }

                }, err => console.log(err, 'error selecting like item'))
            }, err => console.log(err), () => {
                console.log('like has been updated')
            })
        })()

    }
}

// takes an object with an id property as param and registers the id 
// in the archive table  with title indicating what action it was
export const onFailedArchive = payload => {
    return function (dispatch, getState) {
        (async () => {
            const { item, state } = payload
            const fxn = state === 1 ? archived : unarchive;
            // dispatch the archive action constructor
            dispatch(fxn(payload))
            const sql = 'INSERT OR REPLACE INTO archiveunsent( id, title ) VALUES(?,?)'
            const archive = state === 1 ? 'archive' : 'unarchive'
            db.transaction(tx => {
                // insert the id of the article to the archive table 
                // in database to be sent when network is favorable
                tx.executeSql(sql, [item.id, archive], (txObj, { insertId, rowsAffected }) => {
                    console.log(rowsAffected, 'rows affected with  id ', insertId)
                    // update the store and database with the archiveDisperse action constructor
                    dispatch(archiveDisperse(payload))
                }, err => console.log(err, 'error updating archive'))
            }, err => console.log(err), () => {
                console.log('archive has been inserted')
            })
        })()
    }
}

// takes an object params and updates the 
// articles table and the archived property 
// of the displayitems object of the redux store 
export const archiveDisperse = payload => {
    return function (dispatch, getState) {
        (async () => {
            try {
                const { item, state } = payload
                const sql = 'UPDATE articles SET archived = ?  WHERE id = ?'
                const sqli = state === 1 ? 'INSERT OR REPLACE INTO archive( id, category ) VALUES(?,?)' :
                    'DELETE FROM archive WHERE id = ?'
                const val = state === 1 ? [item.id, item.category] : [item.id]
                console.log(val, sqli)
                db.transaction(tx => {
                    // checking the action state
                    const archive = state === 1 ? 1 : 0
                    tx.executeSql(sql, [archive, item.id], (txObj, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            // update the articles table with the specified id                       
                            console.log('article table has been updated for the archived article')
                            txObj.executeSql(sqli, val, (txOb, { rowsAffected }) => {
                                console.log(`${rowsAffected} rows affected`, 'archive table successful update')

                                console.log(payload, 'payload from line 123')
                                const fxn = state === 1 ? archived : unarchive;
                                // // dispatch the archive action constructor
                                dispatch(fxn(payload))
                            }, err => console.log(err, 'archive table not updated'))
                        }
                    }, err => console.log(err, 'error updating archive item'))
                }, err => console.log(err), () => {
                    console.log('article has been archived or unarchived')
                })
            } catch (err) {
                console.log(err, 'error from archive on line 133')
            }
        })()

    }
}

export const setSubject = payload => {
    return {
        type: SET_SUBJECT,
        payload
    }
}

// update that the article has been seen
export const readArticle = payload => {
    return {
        type: READ_ARTICLE,
        payload,
    }
}
export const setCategoryImages = (payload) => {
    return {
        type: SET_CATEGORY_IMAGES,
        payload,
    }
}
export const newOnArticleSuccess = (payload) => {
    return function (dispatch, getState) {
        (async () => {
            const articles = payload
            try {
                for (let i = 0; i < articles.length - 1; i++) {
                    // let currentObj = payload[i]
                    const path = await CacheManager.get(articles[i].image_url).getPath();
                    articles[i]['image_url'] = path
                    // console.log(articles[i].image_url)
                }
                await AsyncStorage.setItem('@articles', JSON.stringify(articles))
            } catch (e) {
                console.log(e, "<===Article success error")
            }
            dispatch(setArticle(articles))
            dispatch(loadingArticleStop())
        })()
    }
}


// sucessfully getting the article
export const onArticleSuccess = (payload) => {
    return function (dispatch, getState) {
        (async () => {
            // console.log(payload)
            const sql = 'INSERT OR REPLACE INTO articles(id, title, body, category, image_url, likes, idioms_1, idioms_2, idioms_3, new_word_1, new_word_2, new_word_3, read, archived, liked ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            const sqli = 'INSERT OR REPLACE INTO archive( id, category ) VALUES(?,?)'
            const sqlx = 'SELECT * FROM archive WHERE id = ?'
            for (let i = 0; i < payload.length; i++) {
                // let currentObj = payload[i]
                const path = await CacheManager.get(payload[i].image_url).getPath();
                // console.log(payload[i].image_url)
                const val = Object.values(payload[i])
                db.transaction(tx => {
                    tx.executeSql(sql, val, (txObj, { insertId, rowsAffected }) => {
                        // console.log(insertId, 'successful insert', `${rowsAffected} row affected`)
                        if (payload[i].archived) {
                            const { id, category } = payload[i]
                            txObj.executeSql(sqlx, [id], (txObx, { rows }) => {
                                if (rows.length < 1) {
                                    txObx.executeSql(sqli, [id, category], (txObI, { rowsAffected }) => {
                                        console.log('successful archive')
                                    }, err => console.log('failed archive'))
                                }
                            }, err => console.log('err in archiving'))
                        }
                    }, err => console.log(err))
                }, (err) => console.log(err),
                    () => console.log('insert transaction successful'))
            }

        })()
        dispatch(setArticle(payload))
        dispatch(loadingArticleStop())
    }
}

// action function for setting the article array
export const setArticle = payload => {
    return {
        type: SETARTICLE,
        payload: payload
    }
}

// action creator for setting article error display page
export const articleLoadingFailed = () => {
    return {
        type: ARTICLE_LOADING_FAILED,
    }
}

// action creator for failed article get
export const articleErrDis = (payload) => {
    return function (dispatch, getState) {
        dispatch(articleLoadingFailed())
        dispatch(loadingArticleStop())
    }
}
export const articleErrRem = () => {
    return {
        type: ARTICLE_REMOVE_ERR,
    }
}



// action creator for serching for archived article
export const searchArchive = payload => {
    return {
        type: SEARCH_ARCHIVE,
        payload
    }
}
export const prevSearchDispatcher = payload => {
    return {
        type: PREV_SEARCH,
        payload
    }
}

// action function for setting upp the loading icon
export const loadingArticle = () => {
    return {
        type: LOADING_ARTICLE
    }
}

// action function for stopping the loading icon
export const loadingArticleStop = () => {
    return {
        type: LOADING_ARTICLE_STOP
    }
}
