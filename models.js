const mongoose = require('mongoose');


const hackerStorySchema = mongoose.Schema({
	title: {type: String, required: true},
	url: {type: String, required: true},
	votes: {type: Number, default: 0}
});

hackerStorySchema.methods.apiRepr = function() {

	return {
		title: this.title,
		url: this.url,
		votes: this.votes,
		id: this.id
	};
}

const HackerStory = mongoose.model('hackerstorys', hackerStorySchema);

module.exports = HackerStory;