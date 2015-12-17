package edu.upenn.nets212.pennbook;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class RecommendReducerPreInit extends Reducer<Text, Text, Text, Text> {

	@Override
	// Our reduce method: reads all values associated with a given vertex.
	// If there is a fully defined edge with a start and end vertex, we collect
	// all ends which might be associated with the start point, and record the
	// rank of the start point. If there is only a start, this is a vertex with
	// no outbound edges, so we simply record its rank. This allows each vertex
	// to be aware of both its rank and neighbors. They need not be aware of
	// their neighbors' ranks, because a part of my "iter" implementation
	// handles informing all vertices of their neighbors ranks when they need
	// this information.
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// Ignore specially-marked data.
		if (key.toString().charAt(0) == '*') {
			for (Text neighbor : values) {
				context.write(new Text(key.toString().substring(1)), neighbor);
			}
		}

		// The rest of this data represents either interests or affiliations.
		// Each of these nodes is paired up with all others. Copy into list to
		// work around strange Hadoop data types.
		List<String> neighbors = new ArrayList<String>();
		for (Text neighbor : values) {
			neighbors.add(neighbor.toString());
		}
		
		for (String neighbor1 : neighbors) {
			for (String neighbor2 : neighbors) {
				System.out.println(key.toString() + " " + neighbor1 + " " + neighbor2);
				if (!neighbor1.equals(neighbor2)) {
					context.write(new Text(neighbor1), new Text(neighbor2));
				}
			}
		}
	}
}