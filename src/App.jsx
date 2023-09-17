import { useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { uniqueCards } from './constant';
import './App.css'

const App = () => {

  const shuffleCards = (list) => {
    const length = list.length;
    for (let i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = list[currentIndex];
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = temp;
    }
    return list;
  }

  return (
    <div className='card-container' >
      <div className='cards' >
        { shuffleCards([...uniqueCards, ...uniqueCards]).map(({img}, index) => <div key={index} className="card">
          <QuestionMarkIcon fontSize='large' style={{ color: '#193A81' }} />
          {/* <img width={100} height={100} src={img} alt="" /> */}
        </div>)}
      </div>
    </div>
  )
}

export default App
