//var s_w = detect_swear_word(message.content);
//if ((s_w[0]) && (message.deletable)) message.delete({reason: 'Offensive words detected: "' + s_w[1] + '"'})
	export default (string) => {
		var clean_string = string.toString().toLowerCase().replace(/\s+/g, '');
		for (let i = 0; i < clean_string.length; i++) {
			var Char = clean_string.charAt(i);
			if (Char == '3' || Char == '@' || Char == '$' || Char == '!') {
				clean_string = clean_string.replace('3', 'e').replace('@', 'a').replace('$', 's').replace('!', 'i');
			}
		}
		var swear_words = ["https://discord.gg/", "fuck", "shit", "bitch", "ass", "cunt", "dick", "pussy", "cock", "nigga", "porn", "gay", "sex", "blowjob", "anal", "cum", "dilto", "tits", "vagina", "penis", "sperm", "balls"]
		var bool = false;
		var words = [];
		swear_words.forEach(function (word, pos) {
			if (clean_string.includes("ass") && clean_string.includes("pass")) { return; }
			if (clean_string.includes(word)) {
				bool = true;
				words.push(word);
			}
		});
		return [bool, words];
	}