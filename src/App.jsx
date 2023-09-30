import { useEffect, useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { UNIQUECARDS } from './constant';
import ConfettiExplosion from 'react-confetti-explosion';
import { v4 as uuidv4 } from 'uuid';
import './App.css'

const App = () => {
  const [cardList, setCardList] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disableDeck, setDisableDeck] = useState(false);

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
        setClearedCards(clearedCards?.filter((id) => {
          if (!openCards?.includes(id)) return id;
        }))
        setOpenCards([]);
        setDisableDeck(false);
      }, 800)
    } else {
      setDisableDeck(false);
      setOpenCards([]);
      if (clearedCards?.length === cardList?.length) {
        setTimeout(() => {
          setShowConfetti(true);
        }, 300)
      }
    }
  }

  const handleClickOnCard = (index) => {
    if (openCards?.includes(index) || clearedCards?.includes(index) || disableDeck) return;
    setOpenCards(prev => ([...prev, index]));
    setClearedCards(prev => ([...prev, index]));
  }

  useEffect(() => {
    if (openCards?.length === 2) {
      setDisableDeck(true);
      matchCards();
    }
  }, [openCards])

  useEffect(() => {
    if (UNIQUECARDS?.length){
      const updatedCards = UNIQUECARDS.map((el) => ({ ...el, id: uuidv4()}))
      shuffleCards([...updatedCards, ...updatedCards])
    }
  }, [])

  return (
    <div className='card-container' >
      <div className='confetti' >
        {showConfetti && <ConfettiExplosion {...{ force: 0.5, duration: 3000, particleCount: 300, width: 2000 }} />}
      </div>
      <div className='cards' >
        {cardList.map(({ img, id }, index) => <div key={id} className={`card ${clearedCards?.includes(index) && 'is-flipped'}`} onClick={() => handleClickOnCard(index)} >
          <QuestionMarkIcon className='view' fontSize='large' style={{ color: '#193A81' }} />
          <img className='view back-view' width={100} height={100} src={img} alt="" />
        </div>)}
      </div>
    </div>
  )
}

export default App
