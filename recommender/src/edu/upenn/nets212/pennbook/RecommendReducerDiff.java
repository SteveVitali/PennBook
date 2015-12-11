package edu.upenn.nets212.pennbook;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class RecommendReducerDiff extends Reducer<Text, Text, Text, Text> {

	@Override
	// Our reduce method: reads all ranks associated with a given vertex.
	// Outputs the absolute difference between the two different ranks.
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// A table for storing the absolute rank differences.
		Map<String, Double> differences = new HashMap<String, Double>();

		// Find the ranks associated with this vertex. There may be two
		// instances of a rank, which allows us to find the difference. If there
		// is only one instance, then the change of rank is simply the
		// newly-seen rank.
		for (Text other : values) {
			String[] node = other.toString().split("=");
			String id = node[0];
			double score = Double.parseDouble(node[1]);

			// Store the difference
			if (!differences.containsKey(id)) {
				differences.put(id, Math.abs(score));
			} else {
				differences.put(id, Math.abs(differences.get(id) - score));
			}
		}

		// Output the absolute difference of the ranks.
		for (String keyID : differences.keySet()) {
			double difference = differences.get(keyID);
			context.write(new Text(key.toString() + ":" + keyID), new Text(
					difference + ""));
		}
	}
}