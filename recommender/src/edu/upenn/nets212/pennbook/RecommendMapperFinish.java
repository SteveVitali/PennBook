package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class RecommendMapperFinish extends
		Mapper<LongWritable, Text, Text, Text> {

	@Override
	// Our map method: outputs intermediate key-value pairs of
	// Text-Text objects. It reads each file in our input
	// directory one line at a time. The corresponding reducer is meant to
	// sort these lines by decreasing rank; this works because
	// there is only one reducer involved.
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		// Split the line into a vertex, and list of friends.
		String line = value.toString();
		String[] row = line.split("\t");
		String id = row[0];
		String[] known = row[4].split(",");

		// Emit all vertex and rank data to a single reducer.
		for (String other : known) {
			String[] otherData = other.split("=");
			context.write(new Text(id), new Text(otherData[0] + "\t"
					+ otherData[1]));
		}
	}
}