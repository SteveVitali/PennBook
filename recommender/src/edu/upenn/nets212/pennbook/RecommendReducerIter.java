package edu.upenn.nets212.pennbook;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class RecommendReducerIter extends Reducer<Text, Text, Text, Text> {

	@Override
	// Our reduce method: reads all values associated with a given vertex.
	// Processes the incoming values into either neighboring vertices or updates
	// to rank. Calculates the new rank, and outputs the vertex, new score, and
	// list of neighbors. This output is ready for further processing by "diff"
	// or "iter".
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// Populate a map with the summation of new scores.
		Map<String, Double> sums = new HashMap<String, Double>();
		String keyID = key.toString();

		// While finding summations, pick out your neighbors.
		int numNeighbors = 0;
		String neighbors = "";
		for (Text value : values) {
			String node = value.toString();

			// Discern neighbors among crowd
			if (node.contains("x")) {
				String[] split = node.split("x");
				String id = split[0];
				double score = Double.parseDouble(split[1]);
				neighbors += (id + ",");
				numNeighbors++;

				// Update this vertex in the summation table
				if (!sums.containsKey(id)) {
					sums.put(id, score);
				} else {
					sums.put(id, score + sums.get(id));
				}
			} else if (node.contains("=")) {
				String[] split = node.split("=");
				String id = split[0];
				double score = Double.parseDouble(split[1]);

				// Update this vertex in the summation table
				if (!sums.containsKey(id)) {
					sums.put(id, score);
				} else {
					sums.put(id, score + sums.get(id));
				}
			}
		}

		// Process list of all known values. Omit the value of this vertex
		// itself.
		String known = "";
		for (String id : sums.keySet()) {
			if (!id.equals(keyID)) {
				double score = sums.get(id);
				known += (id + "=" + score + ",");
			}
		}

		// Fix formatting for knowing nothing
		if (known.length() == 0) {
			known = "-";
		}

		// Find this vertex's own score, with null safety
		double ownScore = 0;
		if (sums.get(keyID) != null) {
			ownScore = sums.get(keyID);
		}

		// Emit the vertex, its new rank, number of neighbors, list of
		// neighbors, and list of known scores.
		context.write(key, new Text(ownScore + "\t" + numNeighbors + "\t"
				+ neighbors + "\t" + known));
	}
}