import { v4 as uuidv4 } from "uuid"
import { BotLevel } from "../../bots/bot"
import type {
	ChallengerType,
	GameSetting,
	GameSettingDataProvider,
} from "../data-provider"

const GAME_SETTINGS_KEY = "game-settings"

const getGameSettings = () => localStorage.getItem(GAME_SETTINGS_KEY)

const setGameSettings = (gameSettings: GameSetting[]) =>
	localStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(gameSettings))

const findAllGameSettings = (): GameSetting[] => {
	const gameSettingsJson = getGameSettings()

	if (gameSettingsJson) return JSON.parse(gameSettingsJson)

	return []
}

const findGameSettingByGameId = (
	gameSettings: GameSetting[],
	gameId: string
): GameSetting | undefined =>
	gameSettings.find((gameSetting) => gameSetting.gameId == gameId)

const findGameSettingIndexById = (
	gameSettings: GameSetting[],
	id: string
): number => gameSettings.findIndex((gameSetting) => gameSetting.id == id)

export const localGameSettingConnector: GameSettingDataProvider = {
	getGameSettingByGameId: (gameId: string): Promise<GameSetting> => {
		const gameSettings = findAllGameSettings()
		if (!gameSettings)
			return Promise.reject(new Error("Game setting not found"))

		const gameSetting = findGameSettingByGameId(gameSettings, gameId)

		if (gameSetting) return Promise.resolve(gameSetting)
		else return Promise.reject(new Error("Game setting not found"))
	},

	createGameSettingByGameId: (
		gameId: string,
		consecutiveTarget: number,
		challengerType: ChallengerType,
		botLevel: BotLevel,
		gameSize: number
	): Promise<GameSetting> => {
		let gameSettings = findAllGameSettings()
		if (!gameSettings) gameSettings = []

		const newGameSetting: GameSetting = {
			id: uuidv4(),
			gameId: gameId,
			consecutiveTarget: consecutiveTarget,
			challengerType: challengerType,
			botLevel: botLevel,
			gameSize: gameSize,
		}

		gameSettings.push(newGameSetting)

		setGameSettings(gameSettings)

		return Promise.resolve(newGameSetting)
	},

	setGameSettingById: (
		id: string,
		challengerType: ChallengerType,
		botLevel: BotLevel,
		gameSize: number
	): Promise<GameSetting> => {
		let gameSettings = findAllGameSettings()
		if (!gameSettings)
			return Promise.reject(new Error("Game setting not found"))

		const gameSettingIndex = findGameSettingIndexById(gameSettings, id)
		if (gameSettingIndex == -1) Promise.reject("Game setting not found")

		gameSettings[gameSettingIndex].challengerType = challengerType
		gameSettings[gameSettingIndex].botLevel = botLevel
		gameSettings[gameSettingIndex].gameSize = gameSize

		setGameSettings(gameSettings)

		return Promise.resolve(gameSettings[gameSettingIndex])
	},
}
