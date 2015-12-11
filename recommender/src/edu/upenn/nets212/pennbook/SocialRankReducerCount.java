package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class SocialRankReducerCount extends Reducer<Text, Text, Text, Text> {

	@Override
	// Outputs the fraction of edges which are bidirectional, after counting the
	// number of each type of edge.
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// Count the number of each type of edge.
		double unidirectional = 0;
		double bidirectional = 0;
		for (Text edgeType : values) {
			if (edgeType.toString().equals("b")) {
				// Every bidirectional edge must reduce by one the number of
				// unidirectional edges, lest the unmarked portion of this edge
				// be counted twice.
				bidirectional++;
				unidirectional--;
			} else {
				unidirectional++;
			}
		}

		// Write the fraction to file
		context.write(new Text("Reciprocity fraction: "
				+ (bidirectional / (unidirectional + bidirectional))),
				new Text(""));
	}
}