package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class RecommendMapperIter extends Mapper<LongWritable, Text, Text, Text> {

	@Override
	// Our map method: outputs intermediate key-value pairs of
	// Text-Text objects. It reads each file in our input
	// directory one line at a time. The corresponding reducer is meant to
	// calculate and store the result of one round of the adsorption algorithm,
	// which can then be processed further by either the "diff" or "iter"
	// commands.
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		// Parse the input line into its vertex, rank, and list of neighbors.
		String line = value.toString();
		String[] row = line.split("\t");
		String vertex = row[0];
		double rank = Double.parseDouble(row[1]);
		int numNeighbors = Integer.parseInt(row[2]);

		// If there are neighbors, then
		if (numNeighbors != 0) {
			// Get the neighbors
			String[] neighbors = row[3].split(",");

			// Redistribute the score of each known-person among all neighbors.
			for (String neighbor : neighbors) {
				// If this vertex knows about other people
				String known = row[4];
				if (!known.equals("-")) {
					String[] others = known.split(",");
					for (String other : others) {
						String[] split = other.split("=");
						String id = split[0];
						double score = Double.parseDouble(split[1]);
						context.write(new Text(neighbor), new Text(id + "="
								+ (score / numNeighbors)));
					}
				}

				// Redistribute your own score to your neighbors.
				// The x lets them know you're a neighbor.
				context.write(new Text(neighbor), new Text(vertex + "x"
						+ (rank / numNeighbors)));
			}
		}
	}
}