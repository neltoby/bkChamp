import React, { useMemo } from 'react'
import { Footer, FooterTab, Button, Text as NativeText } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import isJson from '../processes/isJson'
import { next, skip, settime, setOverlay } from '../actions/quiz'

export default function QuizFooter() {
    const dispatch = useDispatch()
    const level = useSelector(state => state.quiz).level
    const all = isJson(useSelector(state => state.quiz).question)
    const allQuestion = useMemo(() => all, [])
    const skipped = isJson(useSelector(state => state.quiz).skipped)
    const question = isJson(isJson(useSelector(state => state.quiz)).currentQuestion)

    const skipQuestion = (id) => {
        dispatch(skip(id))
        if( level === 'difficult' && allQuestion[level].length === 0 ){
            dispatch(settime(''))
            dispatch(setOverlay('end'))
        }else{
            dispatch(next())
        }
        

        
    }

    return (
        <Footer>
            <FooterTab>
                <Button />
                <Button />
                <Button active />

                {skipped.length === 3 ? 
                    <Button />
                :
                    <Button onPress={() => skipQuestion(question.id)}>
                        <NativeText style={{color: '#fff', fontWeight: 'bold'}}>Skip</NativeText>
                    </Button>
                }
            </FooterTab>
        </Footer>
    )
}
