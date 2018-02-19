export const ajax = async (url) => {
	return await new Promise((resolve, reject) => {
		const req = new XMLHttpRequest()
		req.onreadystatechange = () => {
			if (req.readyState === 4) {
				resolve(req.responseText)
			}
		}

		req.open('get', url)
		req.send()
	})
}

export const parseJSON = (raw) => JSON.parse(raw, (k, v) => {
	let date = Date.parse(v)
	if (!isNaN(date)) {
		return new Date(date)
	}

	return v
})

export const formatDate = (t) => `${t.getFullYear().toString().padStart(4, '0')}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')}`

export const dateRoundDown = (date) => {
	date = new Date(date)

	date.setHours(0)
	date.setMinutes(0)
	date.setSeconds(0)
	date.setMilliseconds(0)

	return date
}

export const dateRoundUp = (date) => {
	date = new Date(date)

	date.setHours(23)
	date.setMinutes(59)
	date.setSeconds(59)
	date.setMilliseconds(999)

	return date
}

export const plural = (str, num) => num === 1 ? str : `${str}s`
