import { useEffect, useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { uniqueCards } from './constant';
import './App.css'

const App = () => {
  const [cardList, setCardList] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState([]);

  const shuffleCards = (list) => {
    const length = list.length;
    for (let i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = list[currentIndex];
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = temp;
    }
    setCardList(list)
  }

  const matchCards = () => {
    const [first, second] = openCards;
    if (cardList[first].img !== cardList[second].img) {
      setTimeout(() => {
        setOpenCards([]);
        setClearedCards(clearedCards?.filter((id) => {
          if (!openCards?.includes(id)) return id;
        }))
      }, 800)
    }
  }

  const handleClickOnCard = (index) => {
    if (openCards?.includes(index)) return;
    if (openCards?.length <= 1) {
      setOpenCards(prev => ([...prev, index]));
      setClearedCards(prev => ([...prev, index]))
    } else {
      setOpenCards([]);
    }
  }

  useEffect(() => {
    if (openCards?.length === 2) {
      matchCards();
    }
  }, [openCards])

  useEffect(() => {
    if (uniqueCards?.length)
      shuffleCards([...uniqueCards, ...uniqueCards])
  }, [])

  return (
    <div className='card-container' >
      <div className='cards' >
        {cardList.map(({ img }, index) => <div key={index} className="card" onClick={() => handleClickOnCard(index)} >
          {
            clearedCards.includes(index) ?
              <img width={100} height={100} src={img} alt="" /> :
              <QuestionMarkIcon fontSize='large' style={{ color: '#193A81' }} />
          }
        </div>)}
      </div>
    </div>
  )
}

export default App
