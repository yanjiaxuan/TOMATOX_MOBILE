import {createStackNavigator} from "react-navigation-stack";
import CustomTab from './custom-tab'
import Player from '../../views/player/player'

export default createStackNavigator({
    Main: {
        screen: CustomTab,
    },
    Player: Player
}, {
    headerMode: 'none',
    mode: 'card',
})
